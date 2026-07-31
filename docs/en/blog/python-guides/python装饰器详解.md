---
title: A Detailed Guide to Python Decorators
createTime: '2025/01/13 14:19:10'
permalink: /en/article/0de7lze1/
lang: en-US
translationOf: /article/0de7lze1/
tags:
  - Python
  - decorators
  - functions
description: Learn Python decorators for extending functions without editing their bodies, including logging, timing, access control, caching, and advanced patterns.
---

### A Detailed Guide to Python Decorators

A Python decorator is a powerful and flexible feature that can change or extend a function's behavior dynamically without modifying the function itself. Decorators are commonly used for logging, performance timing, access control, caching, and similar cross-cutting tasks. Understanding how they work helps you write cleaner and more efficient code.

This guide explains the decorator concept, basic usage, how to define and apply a decorator, and more advanced patterns.

#### 1. What is a decorator?

A decorator is essentially a function that accepts another function and returns a new function. The new function can add capabilities to the original function or alter its behavior.

The central idea is to **add behavior without changing the original function's code**.

#### 2. Basic decorator usage

##### 2.1 Structure of a decorator function

A decorator accepts a function and returns a new one.

```python
def decorator(func):
    def wrapper():
        print("Before function call")
        func()  # Call the original function
        print("After function call")
    return wrapper
```

Here, `decorator` is the decorator function and `wrapper` is the wrapping function. The wrapper runs additional code before and after the original function. `func()` invokes that original function.

##### 2.2 Applying a decorator

Use `@decorator_name` to apply a decorator to a target function. This Python syntax is equivalent to writing `function = decorator(function)`.

```python
@decorator
def say_hello():
    print("Hello, World!")

say_hello()
```

Output:

```text
Before function call
Hello, World!
After function call
```

##### 2.3 How a decorator works

The execution process is:

1. The `say_hello` function is passed to `decorator`.
2. The decorator returns a new function named `wrapper`.
3. `wrapper` contains both the call to the original function and the additional logic.

A decorator therefore modifies behavior through nested functions and function return values.

#### 3. Decorating a function that accepts arguments

If the target function accepts arguments, the decorator's `wrapper` must accept and forward them.

```python
def decorator(func):
    def wrapper(*args, **kwargs):
        print("Before function call")
        result = func(*args, **kwargs)  # Call the original function and forward its arguments
        print("After function call")
        return result
    return wrapper

@decorator
def greet(name):
    print(f"Hello, {name}!")

greet("Alice")
```

Output:

```text
Before function call
Hello, Alice!
After function call
```

In this example, `wrapper` uses `*args` and `**kwargs` to receive and forward the original function's arguments.

#### 4. Decorating a function with a return value

If the original function returns a value, the decorator can process or even modify that value after calling it.

```python
def decorator(func):
    def wrapper(*args, **kwargs):
        print("Before function call")
        result = func(*args, **kwargs)
        print("After function call")
        return result * 2  # Modify the return value
    return wrapper

@decorator
def add(a, b):
    return a + b

print(add(2, 3))  # Output: 10
```

Output:

```text
Before function call
After function call
10
```

The decorator doubles the value returned by `add`.

#### 5. Preserving the original function's metadata with `functools.wraps`

A decorator normally replaces some attributes of the original function, including its name and docstring (`__doc__`). `functools.wraps` preserves those attributes.

```python
from functools import wraps

def decorator(func):
    @wraps(func)  # Preserve the original function's attributes
    def wrapper(*args, **kwargs):
        print("Before function call")
        result = func(*args, **kwargs)
        print("After function call")
        return result
    return wrapper

@decorator
def greet(name):
    """This is a greeting function."""
    print(f"Hello, {name}!")

print(greet.__name__)  # Output: greet
print(greet.__doc__)  # Output: This is a greeting function.
```

Without `wraps`, `greet.__name__` would be `wrapper` instead of `greet`, and `greet.__doc__` would be `None`.

#### 6. Decorators that accept arguments

Sometimes the decorator itself needs parameters—for example, to alter its behavior based on a condition. Add another enclosing function to implement this pattern.

```python
def decorator_with_args(arg):
    def decorator(func):
        def wrapper(*args, **kwargs):
            print(f"Decorator argument: {arg}")
            return func(*args, **kwargs)
        return wrapper
    return decorator

@decorator_with_args("Hello")
def greet(name):
    print(f"Hello, {name}!")

greet("Alice")
```

Output:

```text
Decorator argument: Hello
Hello, Alice!
```

Here, `decorator_with_args` accepts the argument and returns a decorator, which then returns the final wrapper.

#### 7. Common decorator applications

Decorators have many practical uses:

- **Memoization:** Cache function results to avoid repeating a calculation.

```python
def cache(func):
    memo = {}
    def wrapper(*args):
        if args not in memo:
            memo[args] = func(*args)
        return memo[args]
    return wrapper

@cache
def slow_function(x):
    print("Computing...")
    return x * 2

print(slow_function(2))  # Compute and cache the result
print(slow_function(2))  # Return the cached result directly
```

- **Permission checks:** Verify that a user may perform an operation.

```python
def requires_permission(func):
    def wrapper(user, *args, **kwargs):
        if not user.has_permission:
            raise PermissionError("User does not have permission.")
        return func(user, *args, **kwargs)
    return wrapper
```

#### 8. Summary

Decorators can add or modify behavior dynamically without changing the original function's code. They are widely used for logging, caching, permission checks, and similar concerns, helping keep code clear, reusable, and efficient.

Learning how to define and apply decorators gives you a flexible tool for everyday Python development.

If you have questions about decorators or need a more complex pattern, feel free to ask.

---

Read more at [https://ermao.net/en/](https://ermao.net/en/).
