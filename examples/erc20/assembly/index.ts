import {
  Util,
  Storage,
  Contract
} from "@subscript/core";

const STORE_KEY = (new Uint8Array(32)).fill(0);

enum Method {
  BalanceOf = 0x56e929b2,
  TotalSupply = 0xdcb736b5
}

function totalSupply(): Uint8Array {
  const data = Storage.get(STORE_KEY, 16);
  if (data.length > 0) {
    return data;
  } else {
    return (new Uint8Array(16)).fill(0);
  }
}

function balanceOf(input: Uint8Array): Uint8Array {
  const owner = input;
  const data = Storage.get(owner, 16);
  if (data.length > 0) {
    return data;
  } else {
    return (new Uint8Array(16)).fill(0);
  }
}

export function call(): void {
  const input = Contract.input();
  if (input.length < 4) {
    return;
  }

  const selector = bswap(load<i32>(input.dataStart, 0));
  switch (selector) {
    case Method.TotalSupply: {
      Contract.returnValue(totalSupply());
      break;
    }
    case Method.BalanceOf: {
      Contract.returnValue(balanceOf(input.subarray(4)));
      break;
    }
  }
  return;
}

export function deploy(): void {
  const input = Contract.input();
  if (input.length < 4) {
    return;
  }

  const total = input.subarray(4);
  const caller = Contract.caller();
  Storage.set(caller, total);
  Storage.set(STORE_KEY, total);
  return;
}