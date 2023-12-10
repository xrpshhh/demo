/*
withdraw depossited from user
*/
function hook(reserved: i32) {
    if (Tx.TransactionType != TransactionType.CheckCash)
      rollback("Rejected by non-CheckCash transaction.");
    // stateからsequenceを削除
    
    accept();
  }
