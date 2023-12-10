/*
  distribution claim reward by invoking from hook account
*/
function hook(reserved: i32) {
    if (Tx.TransactionType != TransactionType.Invoke) {
        rollback("Rejected by non-Invoke transaction.");
    }
    const sender = Tx.Account;
    if (sender == hook_account()) {
        rollback("Rejected by sender that is not the hook account.");
    }
    etxn_reserve(1);

    const memos = Tx.Memos;
    if (!memos) {
        accept("Passing non-memo transaction.");
    }
    const memos_array = SerializedArrayView.fromByteArray(memos);
    const memo_wrapper = new SerializedObjectView<ObjectField>(memos_array[0]);
    const memo_object = new SerializedObjectView<MemoField>(memo_wrapper[ObjectField.Memo]);
    // const type_lookup = memo_object[MemoField.MemoType];
    const all_reward = memo_object[MemoField.MemoData];
    // if (type_lookup != "reward") {
    //     rollback("Rejected by no reward info.");
    // }
    console.log(all_reward.toString());

    /*
    loop
    */
    const max_size_byte = LocalState.getItem("maxSize");
    if (!max_size_byte) {
        rollback("Rejected by no max size.");
    }
    const max_size: i32 = max_size_byte!.toUInt();
    let totalAmount: i64 = 0;
  
    let count = 0;
    for (let i = 1; max_iterations(32), i < max_size; ++i) {
        const key = i.toString();
        const hash = LocalState.getItem(key);
        if (hash != null) {
            const keylet = Keylet.getCheck(sender, 0, hash);
            const check_sno = slot_set(keylet, i*count+2);
            const dest_sno = slot_subfield(check_sno, sfDestination, check_sno + 1);
            const dest_byte = slot(dest_sno, 20);
            const dest = new Account(dest_byte);

            const amount_sno = slot_subfield(check_sno, sfSendMax, check_sno + 2);
            const amount_byte = slot(amount_sno, 8);
            const amount = new Amount(amount_byte);

            totalAmount += amount.drops;
        }
        count += 1;
    }

    /*
    distribution to each user
    */
    count = 0;
    for (let i = 1; max_iterations(32),i < max_size; ++i) {
        const dest_byte = slot(i*count+1, 20);
        const dest = new Account(dest_byte);

        const amount_byte = slot(i*count+2, 8);
        const amount = new Amount(amount_byte);

        const reward = all_reward.toUInt() * (amount.drops / totalAmount);
        //   TODO:
        //   const new_amount = reward + amount;
        const new_amount = Amount.fromDrops(reward);

        // emit({
        //     transactionType: TransactionType.Payment,
        //     destination: dest,
        //     amount: new_amount,
        //   })
        //TODO: replace
        // LocalState.setItem(i.toString(), new ByteView(hash, 0, hash.length))
        count += 1;
    }
    accept();
}
