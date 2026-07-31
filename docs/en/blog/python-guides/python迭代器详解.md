---
title: A Detailed Guide to Python Iterators
createTime: '2025/01/13 14:18:01'
permalink: /en/article/r6u6yjj9/
lang: en-US
translationOf: /article/r6u6yjj9/
tags:
  - Python
  - iterators
  - iterables
  - generators
  - lazy loading
  - infinite sequences
  - pipeline processing
description: Learn Python's iterator protocol, stateful traversal, custom iterators, lazy access, common applications, performance, and best practices.
---

### A Detailed Guide to Python Iterators

In Python, an **iterator** is an object used to access the elements of a collection. In addition to traversing the collection, it retains state while doing so. This lets you retrieve items incrementally when they are needed instead of loading every item into memory at once. Learning to use iterators can make code more efficient and memory-conscious.

This guide explains the iterator concept, how to define an iterator, common applications, and several more advanced techniques.

#### 1. What is an iterator?

An iterator is an object that implements Python's iterator protocol. The protocol requires two methods:

- `__iter__()`: Returns the iterator object itself.
- `__next__()`: Returns the next element. If no elements remain, it raises `StopIteration` to signal the end of iteration.

##### The iterator protocol

- `__iter__()`: Returns the iterator object, normally `self`.
- `__next__()`: Returns the next element or raises `StopIteration` when iteration is complete.

#### 2. How do you define an iterator?

A custom Python iterator is normally a class containing `__iter__()` and `__next__()` methods:

```python
class MyIterator:
    def __init__(self, start, end):
        self.current = start
        self.end = end

    def __iter__(self):
        return self  # Return the iterator object itself

    def __next__(self):
        if self.current >= self.end:
            raise StopIteration  # Signal the end of iteration
        self.current += 1
        return self.current - 1

# Use the iterator
my_iter = MyIterator(0, 5)
for num in my_iter:
    print(num)
```

Output:

```text
0
1
2
3
4
```

`MyIterator` accepts a starting and ending value and returns each value in order. Once it reaches the end, it raises `StopIteration`.

#### 3. Iterator objects in Python

Many built-in Python objects, including lists, tuples, and dictionaries, are iterable. You can obtain an iterator for them directly:

```python
lst = [1, 2, 3]
it = iter(lst)  # Obtain an iterator
print(next(it))  # Output: 1
print(next(it))  # Output: 2
print(next(it))  # Output: 3
```

Here, `iter()` obtains an iterator for the list and `next()` retrieves the next item.

#### 4. Iterators and iterables

- **Iterable:** Any object that implements `__iter__()` or `__getitem__()` is iterable. Common examples include lists, tuples, dictionaries, sets, and strings.
- **Iterator:** Every iterator is iterable, but not every iterable is itself an iterator. Call `iter()` to obtain an iterator from an iterable.

```python
# Iterable object
lst = [1, 2, 3]
print(isinstance(lst, Iterable))  # Output: True

# Iterator object
it = iter(lst)
print(isinstance(it, Iterator))  # Output: True
```

#### 5. Iterator use cases

- **Saving memory:** Iterators avoid loading all data into memory at once, which is especially useful for large data sets.
- **Processing infinite sequences:** An iterator can represent an unbounded sequence of numbers or another stream because it produces elements dynamically as they are requested.
- **Lazy loading:** Like generators, iterators use lazy evaluation and are well suited to loading large data sets incrementally.

For example, an iterator can produce an infinite Fibonacci sequence:

```python
class FibonacciIterator:
    def __init__(self):
        self.a, self.b = 0, 1

    def __iter__(self):
        return self

    def __next__(self):
        a, self.a, self.b = self.a, self.b, self.a + self.b
        return a

# Produce an unbounded Fibonacci sequence
fib = FibonacciIterator()
for _ in range(10):
    print(next(fib))
```

Output:

```text
0
1
1
2
3
5
8
13
21
34
```

#### 6. Iterator performance

- **Memory efficiency:** Because iterators are evaluated lazily, they produce an element only when it is needed and therefore consume less memory.
- **Streaming:** An iterator lets processing begin before a complete data set has been loaded.

#### 7. Iterator best practices

- Favor iterators over loading an entire large data set into memory. Both generators and iterators help with large-scale processing.
- When designing a custom iterator, implement `__iter__()` and `__next__()` correctly and raise `StopIteration` at the end.
- Traverse iterators with a `for` loop so Python handles the termination condition automatically.

#### 8. Iterators versus generators

A generator is one way to implement an iterator, but there are several differences:

- A generator produces data with `yield`; a custom iterator returns it from `__next__()`.
- A generator is more concise and works well for a lazily evaluated stream. A custom iterator is useful when the state or control logic is more complex.
- A generator implements the iterator protocol, but an iterator is not necessarily a generator.

#### Summary

Python iterators provide an elegant way to process elements without loading an entire collection at once. Understanding their design and implementation helps you write faster, more memory-efficient code. They are essential in data processing, large data sets, and streaming workflows.

If you would like to explore more advanced iterator techniques or have another question, feel free to ask.

---

Read more at [https://ermao.net/en/](https://ermao.net/en/).
