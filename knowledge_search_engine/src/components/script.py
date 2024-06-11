import json

dic = {}
with open('dataset/webdict/webdict_with_freq.txt', encoding='utf8') as f:
    for st in f.readlines():
        word, freq = st.strip().split()
        freq = int(freq)
        if freq < 150:
            continue
        for i in range(len(word)):
            if word[:i+1] not in dic:
                dic[word[:i+1]] = []
            dic[word[:i+1]].append((word, freq))

with open('webdict_with_freq.json', 'w', encoding='utf8') as f:
    json.dump(dic, f, ensure_ascii=False, indent=4)