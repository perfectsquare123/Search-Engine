import dictionary from "./webdict_with_freq.json"

const dic = dictionary;

function processDictionary() {
  for (const token in dic) {
    const lstRaw = dic[token];
    const mp = {};

    for (const [st, freq] of lstRaw) {
      mp[st] = freq;
    }

    for (const [st, freq] of lstRaw) {
      for (let i = 0; i < st.length - 1; i++) {
        const subPrefix = st.slice(0, i + 1);
        if (mp[subPrefix] && mp[subPrefix] < freq * 10) {
          delete mp[subPrefix];
        }
      }
    }

    const lstNew = [];
    for (const x in mp) {
      lstNew.push([x, mp[x] * x.length]);
    }

    lstNew.sort((a, b) => b[1] - a[1]);
    dic[token] = lstNew;
  }
}

processDictionary();

export function autoFill(st) {
  if (dic[st]) {
    const lst = dic[st];
    return lst.slice(0, Math.min(lst.length, 10)).map(x => x[0]);
  } else {
    return [];
  }
}