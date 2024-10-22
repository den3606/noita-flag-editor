// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod memory;
mod target_address;

use regex::Regex;
use std::fs::{self, OpenOptions};
use std::io::{self, Read, Write};
use std::sync::{mpsc, Arc, Mutex};
use std::thread;
use std::time::{Duration, Instant};
use tauri::Manager;
use tera::{Context, Tera};
use winapi::shared::minwindef::TRUE;
use winapi::um::handleapi::CloseHandle;
use winapi::um::winnt::HANDLE;

#[tauri::command]
async fn start_game_status_monitor(app_handle: tauri::AppHandle) -> Result<String, String> {
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        let result = monitor_game_status(tx);
        if let Err(e) = result {
            eprintln!("Error: {:?}", e);
        }
    });

    // スレッドからの通知を非同期で処理
    tauri::async_runtime::spawn(async move {
        while let Ok(status) = rx.recv() {
            match status {
                MonitorStatus::Death => {
                    app_handle.emit_all("game-status", "death").unwrap();
                }
                MonitorStatus::Connected => {
                    app_handle.emit_all("game-status", "connected").unwrap();
                }
                MonitorStatus::Close => {
                    app_handle.emit_all("game-status", "close").unwrap();
                    break;
                }
                MonitorStatus::Timeout => {
                    app_handle.emit_all("game-status", "timeout").unwrap();
                    break;
                }
            }
        }
    });

    Ok(String::from("Monitoring started"))
}

#[tauri::command]
async fn stop_game_status_monitor() -> Result<(), String> {
    eprint!("stop");

    *SHOULD_STOP.lock().unwrap() = true;

    Ok(())
}

enum MonitorStatus {
    Death,
    Close,
    Timeout,
    Connected,
}

fn monitor_game_status(tx: std::sync::mpsc::Sender<MonitorStatus>) -> io::Result<()> {
    let process_name = "noita.exe";
    let death_address: u32 = target_address::ADDRESS_20240812.death;

    let mut start_time = Instant::now();
    let mut updated = false;
    let mut connected = false;
    *SHOULD_STOP.lock().unwrap() = false;

    loop {
        eprint!("looping");
        if *SHOULD_STOP.lock().unwrap() {
            eprint!("force");
            tx.send(MonitorStatus::Close).unwrap();
            return Ok(());
        } else if start_time.elapsed() > Duration::from_secs(6) {
            eprint!("timeout");
            // 5秒以上プロセスが見つからなかった場合、失敗とする
            eprintln!("Failed to find Noita process within 5 seconds.");
            tx.send(MonitorStatus::Timeout).unwrap();
            return Ok(());
        }

        if let Some((handle, _pid)) = memory::find_process_by_name(process_name) {
            if !connected {
                connected = true;
                tx.send(MonitorStatus::Connected).unwrap();
            }
            let death_state = read_memory(handle, death_address)?;

            if death_state == TRUE as u32 {
                if !updated {
                    updated = true;
                    tx.send(MonitorStatus::Death).unwrap();
                }
            } else {
                if updated {
                    // New Gameのとき
                    updated = false;
                }
            }

            // プロセスが見つかった場合、タイマーをリセット
            start_time = Instant::now();
            unsafe { CloseHandle(handle) };
        }

        thread::sleep(Duration::from_secs(1));
    }
}

lazy_static::lazy_static! {
    static ref SHOULD_STOP: Arc<Mutex<bool>> = Arc::new(Mutex::new(false));
}

fn read_memory(handle: HANDLE, address: u32) -> io::Result<u32> {
    if let Some(base_address) = memory::get_base_address(handle) {
        let target_address = base_address + address;
        let result = memory::read_memory_address_safe(handle, target_address);

        return match result {
            Some(address) => Ok(address),
            None => Err(io::Error::last_os_error()),
        };
    }
    eprintln!("Failed to get base address.");
    Err(io::Error::last_os_error())
}

fn add_win_streak(file_path: &str, template: &str, change: u32) -> io::Result<()> {
    // ファイルを読み取りモードで開く
    let mut file = OpenOptions::new().read(true).open(file_path)?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;

    let mut win_streak: u32 = extract_win_streak_from(template, &contents).unwrap_or(0);
    println!("extracted winstrek count: {}", win_streak);
    win_streak += change;

    let text = match generate_text_from(template, win_streak) {
        Ok(text) => text,
        Err(error_message) => {
            eprintln!("{}", error_message);
            return Ok(());
        }
    };

    println!("{}", text);

    // ファイルを再度書き込みモードで開く（内容をクリア）
    let mut file = OpenOptions::new()
        .write(true)
        .truncate(true)
        .open(file_path)?;
    file.write_all(text.as_bytes())?;

    println!("Win streak updated to: {}", win_streak);
    Ok(())
}

fn reset_win_streak(file_path: &str, template: &str) -> io::Result<()> {
    let mut file = OpenOptions::new().write(true).open(file_path)?;
    file.set_len(0)?;

    match generate_text_from(template, 0) {
        Ok(text) => file.write_all(text.as_bytes())?,
        Err(error_message) => eprintln!("{}", error_message),
    }

    println!("Win streak reset to: 0");
    Ok(())
}

fn generate_text_from(template: &str, win_streak: u32) -> Result<String, String> {
    let mut context = Context::new();
    context.insert("win_streak", &win_streak);
    match Tera::one_off(template, &context, false) {
        Ok(text) => Ok(text),
        Err(_) => Err(String::from("can not parse from text")),
    }
}

fn extract_win_streak_from(template: &str, s: &str) -> Result<u32, String> {
    // 正規表現の特殊文字をエスケープする関数
    fn escape_regex(s: &str) -> String {
        regex::escape(s)
    }

    // テンプレート中の`{{winstreak}}`を正規表現パターンに変換
    let escaped_template = escape_regex(template);
    let pattern = escaped_template.replace(r"\{\{win_streak\}\}", r"(\d+)");

    // 正規表現を作成
    let re = Regex::new(&pattern).map_err(|e| e.to_string())?;

    // マッチを探す
    if let Some(captures) = re.captures(s) {
        if let Some(matched) = captures.get(1) {
            eprintln!("matched number: {}", matched.as_str());
            return matched.as_str().parse::<u32>().map_err(|e| e.to_string());
        }
    }

    Err("Invalid format".to_string())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            start_game_status_monitor,
            stop_game_status_monitor
        ])
        .plugin(tauri_plugin_persisted_scope::init())
        .plugin(tauri_plugin_fs_watch::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
