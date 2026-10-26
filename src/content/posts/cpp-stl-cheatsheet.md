---
title: C++ 刷题速查：常用 STL 容器
description: 刷算法题时最常用的 STL 容器 API 速查——vector、string、map、set 及队列栈堆，附复杂度与常见坑。
pubDate: 2026-10-26
type: tech
tags: [C++, STL, 数据结构]
---

刷题时八成的代码都围着几个 STL 容器转。这篇是纯速查表：每个 API 一行说明、复杂度标在注释里，每个大项末尾附「坑」。按需跳读，不用从头看到尾。

## vector：动态数组

刷题出场率第一。动态扩容、随机访问，也是邻接表和 DP 数组的底座。

```cpp
vector<int> v;                 // 空数组
vector<int> v1(n, 0);          // n 个 0
vector<vector<int>> g(n);      // n 个空数组（邻接表常用）
vector<int> v2 = {1, 2, 3};    // 列表初始化

v.push_back(x);                // 尾插，O(1) 均摊
v.emplace_back(a, b);          // 原地构造，免一次拷贝，O(1) 均摊
v.pop_back();                  // 尾删，O(1)
v[i];                          // 随机访问，O(1)，不检查越界
v.front(); v.back();           // 首尾元素，O(1)
v.insert(v.begin() + i, x);    // 中间插入，O(n)
v.erase(v.begin() + i);        // 中间删除，O(n)
v.size(); v.empty(); v.clear();// 长度 / 判空 / 清空，O(1)（clear 后 capacity 保留）
v.resize(n);                   // 改变长度，变大多出的位置填默认值

sort(v.begin(), v.end());      // 排序，O(n log n)
// 降序：sort(v.begin(), v.end(), greater<int>());
// 去重前先排序：
sort(v.begin(), v.end());
v.erase(unique(v.begin(), v.end()), v.end());  // 排序 + 去重
```

**坑：**

- `v[i]` 越界是未定义行为（不报错），调试期拿不准就用 `v.at(i)`，越界会抛异常
- `push_back` 触发扩容时，所有迭代器、指针、引用全部失效——扩容前的 `&v[0]` 不能再用
- 遍历中删除要用返回值：`it = v.erase(it);`，否则迭代器跳空
- 二维数组要显式初始化内层：`vector<vector<int>> g(n, vector<int>(m));`，只写 `g(n)` 是 n 行空行
- `vector<bool>` 是位压缩的特化，`v[i]` 返回的不是真正的 `bool&`，取引用会编译报错

## string：字符串

本质是 `vector<char>` 的加强版，多了与数字互转、查找、拼接这些高频操作。

```cpp
string s = "hello";
s.size();                      // 长度，O(1)
s[i];                          // 访问单个字符，O(1)
s += " world";                 // 尾接字符串，O(n)
s.push_back('!');              // 尾插单字符，O(1) 均摊
s.substr(pos, len);            // 取子串，O(len)；len 省略则到末尾
s.find("ll");                  // 查子串，返回首下标；O(n·m)
s.find('e');                   // 查单字符也行
s.insert(pos, "x");            // 插入，O(n)
s.erase(pos, len);             // 删除，O(n)
sort(s.begin(), s.end());      // 字符串可以直接排序（变位词题常用）

// 数字 <-> 字符串
to_string(123);                // 数字转字符串
stoi(s); stoll(s);             // 字符串转 int / long long

// 单字符判断（<cctype>）
isdigit(c); isalpha(c); islower(c); isupper(c);
tolower(c); toupper(c);
```

**坑：**

- `find` 找不到返回 `string::npos`（无符号的巨大值），判断只能写 `s.find(x) == string::npos`，别和 `-1` 或 `0` 比大小
- `substr(pos)` 的 `pos` 越界直接抛 `out_of_range`；`len` 超长倒是安全的，自动截断到末尾
- `c_str()` 返回的指针在 `s` 被修改（扩容/析构）后失效，别存下来用
- 两个 `string` 比较字典序直接用 `==` `<`，C 风格的 `strcmp` 不需要
- `s[i]` 可读可写，想原地修改大小写直接 `s[i] = toupper(s[i])` 即可

## map / unordered_map：键值对

两个都要会：`map` 是红黑树（key 有序），`unordered_map` 是哈希表（读写更快）。

```cpp
map<int, string> m;                  // 红黑树，遍历按 key 升序，O(log n) 操作
unordered_map<int, string> um;       // 哈希表，平均 O(1)，无序

m[key] = val;                  // 存在则覆盖；不存在则插入（val 走默认构造）
m[key];                        // ⚠️ 纯访问也会给不存在的 key 插入默认值！
m.at(key);                     // 访问，不存在则抛异常
m.insert({k, v});              // 插入；key 已存在时不覆盖
m.emplace(k, v);               // 同上，原地构造
m.count(k);                    // 判存在，返回 0 或 1
m.find(k);                     // 迭代器查找，找不到返回 m.end()
m.erase(k);                    // 按 key 删除，O(log n)（哈希为 O(1) 均摊）
m.size(); m.empty(); m.clear();

// 遍历：map 按 key 升序（C++17 结构化绑定）
for (auto& [k, v] : m) {
    // k 是 const，不能修改；v 可改
}

// 统计频次的惯用法
unordered_map<char, int> cnt;
for (char c : s) cnt[c]++;
```

**map 还是 unordered_map：**

- 需要按 key 有序输出、范围查询（`lower_bound`）→ `map`
- 只做存取、判存在、计数 → `unordered_map`（更快）；最坏会被卡到 O(n)，极少遇到
- `unordered_map` 的 key 类型必须可哈希，`pair`/自定义结构体做 key 要额外提供 hash

**坑：**

- `m[key]` 查询不存在的 key 会**插入**一个默认值——只想判存在用 `count`/`find`，否则循环里误访问会让 `size()` 莫名变大
- map 的 key 是 const，结构化绑定里 `k` 改不了，改值只能动 `v`
- 自定义类型做 `map` 的 key 要重载 `operator<`；做 `unordered_map` 的 key 要写 hash + `operator==`
- 想按 value 排序：map 本身做不了，先把 `(value, key)` 拷进 `vector` 再 `sort`

## set / unordered_set：集合

自动去重的集合，`map` 砍掉 value 的版本，API 一脉相承。

```cpp
set<int> s;                    // 红黑树，升序 + 去重，O(log n)
unordered_set<int> us;         // 哈希去重，平均 O(1)
multiset<int> ms;              // 允许重复的有序集合

s.insert(x);                   // 插入，O(log n)；返回 pair<迭代器, 是否成功>
s.count(x);                    // 判存在，0 或 1
s.find(x);                     // 迭代器查找
s.erase(x);                    // 按值删除，O(log n)
s.size(); s.empty(); s.clear();

*s.begin();                    // 最小值
*s.rbegin();                   // 最大值
s.lower_bound(x);              // 第一个 >= x 的元素的迭代器，O(log n)
s.upper_bound(x);              // 第一个 >  x 的元素的迭代器
// 用途：最接近 x 的元素、"不低于某值的最小元素"类问题
```

**坑：**

- 没有 `operator[]`，判存在只能 `count`/`find`，别顺手写 `s[x]`
- `multiset.erase(x)` 会删掉**所有**等于 x 的元素；只想删一个要 `ms.erase(ms.find(x))`
- set 的迭代器是 const，不能通过迭代器改元素的值——改值 = 先 erase 再 insert
- `lower_bound` 是成员函数版（二分树内查找 O(log n)）；写成 `lower_bound(s.begin(), s.end(), x)` 是对迭代器线性扫描，效率差一个数量级

## 队列、栈、双端队列、堆

这四个 API 少，各配一句典型场景。

```cpp
// queue：FIFO，BFS 标配
queue<int> q;
q.push(x);                     // 队尾入，O(1)
q.pop();                       // 队头出，O(1)，无返回值
q.front(); q.back();           // 看队头 / 队尾
q.empty(); q.size();

// stack：LIFO，括号匹配、单调栈
stack<int> st;
st.push(x);                    // 入栈，O(1)
st.pop();                      // 出栈，O(1)，无返回值
st.top();                      // 看栈顶
st.empty(); st.size();

// deque：两端都能进出，还能随机访问，滑动窗口单调队列标配
deque<int> dq;
dq.push_back(x); dq.push_front(x);   // 两端插入，O(1)
dq.pop_back();   dq.pop_front();     // 两端弹出，O(1)
dq[i];                               // 随机访问，O(1)

// priority_queue：默认大根堆，TopK、Dijkstra
priority_queue<int> pq;              // 大根堆，top() 是最大值
pq.push(x);                          // 插入，O(log n)
pq.pop();                            // 弹出堆顶，O(log n)，无返回值
pq.top();                            // 看堆顶，O(1)

// 小根堆：加 greater 比较器
priority_queue<int, vector<int>, greater<int>> minpq;

// 自定义比较（按第二个分量小的优先）
auto cmp = [](const pair<int,int>& a, const pair<int,int>& b) {
    return a.second > b.second;      // 返回 true 表示 a 排在 b 后面
};
priority_queue<pair<int,int>, vector<pair<int,int>>, decltype(cmp)> pq2(cmp);
```

**坑：**

- `pop()` 一律没有返回值，取值必须先 `front()`/`top()` 再 `pop()`，顺序反了就是 UB
- 空 `stack`/`queue`/堆 上调 `top()`/`front()`/`pop()` 都是 UB，循环条件先写 `!empty()`
- `priority_queue` 的比较器逻辑和 `sort` 相反：比较器里写 `a > b` 语义是"a 优先级低"，默认就是大根堆；小根堆才用 `greater`

## 一句话选型

| 需求 | 用什么 |
| --- | --- |
| 动态数组、邻接表、DP | `vector` |
| 有序 + 去重 / 有序 + 计数 | `set` / `multiset` |
| 只判存在、去重，不在乎顺序 | `unordered_set` |
| 有序键值映射、范围查询 | `map` |
| 键值读写、计数 | `unordered_map` |
| BFS、先进先出 | `queue` |
| DFS 手工栈、括号、单调栈 | `stack` |
| 滑动窗口最值 | `deque` |
| TopK、最短路径 | `priority_queue` |

API 就这些，剩下的组合拳（双指针、二分、前缀和）都是架在这些容器上的套路，以后另开一篇。
