// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod memory;
mod target_address;

use std::io::{self};
use std::sync::{mpsc, Arc, Mutex};
use std::thread;
use std::time::{Duration, Instant};
use tauri::{AppHandle, Emitter};
use winapi::shared::minwindef::TRUE;
use winapi::um::handleapi::CloseHandle;
use winapi::um::winnt::HANDLE;

#[tauri::command]
async fn start_game_status_monitor(app: AppHandle) -> Result<String, String> {
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
                    app.emit("game-status", "death").unwrap();
                }
                MonitorStatus::Connected => {
                    app.emit("game-status", "connected").unwrap();
                }
                MonitorStatus::Close => {
                    app.emit("game-status", "close").unwrap();
                    break;
                }
                MonitorStatus::Timeout => {
                    app.emit("game-status", "timeout").unwrap();
                    break;
                }
            }
        }
    });

    Ok(String::from("Monitoring started"))
}

#[tauri::command]
async fn stop_game_status_monitor() -> Result<(), String> {
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
    let death_address: u32 = target_address::LATEST_ADDRESS.death;

    let mut start_time = Instant::now();
    let mut updated = false;
    let mut connected = false;
    *SHOULD_STOP.lock().unwrap() = false;

    loop {
        if *SHOULD_STOP.lock().unwrap() {
            tx.send(MonitorStatus::Close).unwrap();
            return Ok(());
        } else if start_time.elapsed() > Duration::from_secs(6) {
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

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            start_game_status_monitor,
            stop_game_status_monitor
        ])
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
