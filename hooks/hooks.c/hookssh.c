#include "hookapi.h"
#include <stdint.h>

int64_t hook(uint32_t reserved) {
  TRACESTR("shhh..")
  unsigned char hook_accid[20];
  hook_account((uint32_t)hook_accid, 20);

  uint8_t account_field[20];
  int32_t account_field_len = otxn_field(SBUF(account_field), sfAccount);
  TRACEVAR(account_field_len);

  _g(1, 1);
  accept(SBUF("Shhh: Last Line!"), 0);
  return 0;
}