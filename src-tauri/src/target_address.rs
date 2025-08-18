pub struct Address {
    pub death: u32,
    #[allow(unused)]
    pub death_count: u32,
}

#[allow(unused)]
pub const ADDRESS_20240430: Address = Address {
    death: 0xE06704,       // 死亡状態 0/1
    death_count: 0xE06A78, //合計死亡回数
};

pub const ADDRESS_20240812: Address = Address {
    death: 0xE06764,
    death_count: 0xE06AD8,
};

pub const ADDRESS_20250125: Address = Address {
    death: 0xE08784,
    death_count: 0xE08AF8,
};
