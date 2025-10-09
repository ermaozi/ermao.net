---
title: python装饰器详解
createTime: 2025/01/13 14:19:10
permalink: /article/0de7lze1/
tags:
    - Python
    - 装饰器
    - 函数
---
### Python 装饰器详解

Python 装饰器（Decorator）是一个非常强大且灵活的特性，它允许你在不修改函数本身的情况下，动态地改变或扩展函数的行为。装饰器通常用于以下场景：日志记录、性能计时、访问控制、缓存等。理解装饰器的原理和使用方法将使你能够编写更加优雅且高效的代码。

本文将详细讲解 Python 装饰器的概念、基本用法、如何定义和应用装饰器，及其高级用法。

#### 1. 什么是装饰器？

装饰器本质上是一个函数，它接受一个函数作为参数，并返回一个新的函数。这个新的函数可以在原始函数的基础上增加功能或修改行为。

装饰器的核心思想是：**在不改变原始函数代码的情况下，增加额外的功能**。

#### 2. 装饰器的基本用法

##### 2.1 装饰器函数的结构

装饰器是一个函数，它接受一个函数作为参数，然后返回一个新的函数。

```python
def decorator(func):
    def wrapper():
        print("Before function call")
        func()  # 调用原始函数
        print("After function call")
    return wrapper
```

在上面的代码中，`decorator` 是装饰器函数，`wrapper` 是包装函数，它会在调用原始函数之前和之后执行一些额外的代码。`func()` 是原始函数的调用。

##### 2.2 使用装饰器

装饰器可以通过 `@decorator_name` 的语法应用到目标函数上。这种方式是 Python 提供的语法糖，等价于 `function = decorator(function)`。

```python
@decorator
def say_hello():
    print("Hello, World!")

say_hello()
```

输出：
```
Before function call
Hello, World!
After function call
```

##### 2.3 装饰器的工作原理

装饰器的执行过程是这样的：

1. `say_hello` 函数作为参数传递给装饰器 `decorator`。
2. 装饰器返回了一个新的函数 `wrapper`。
3. `wrapper` 函数包含了对原始函数的调用以及额外的逻辑。

装饰器本质上是通过函数嵌套和返回来修改函数的行为。

#### 3. 带参数的装饰器

如果你的装饰器要处理带参数的函数，你需要确保装饰器内部的 `wrapper` 函数能够接收传递给原始函数的参数。

```python
def decorator(func):
    def wrapper(*args, **kwargs):
        print("Before function call")
        result = func(*args, **kwargs)  # 调用原始函数，并传递参数
        print("After function call")
        return result
    return wrapper

@decorator
def greet(name):
    print(f"Hello, {name}!")

greet("Alice")
```

输出：
```
Before function call
Hello, Alice!
After function call
```

在这个例子中，`wrapper` 函数通过 `*args` 和 `**kwargs` 来接收并传递原始函数的参数。

#### 4. 使用装饰器带有返回值的函数

如果原始函数有返回值，装饰器可以在调用函数后处理返回值，甚至修改返回值。

```python
def decorator(func):
    def wrapper(*args, **kwargs):
        print("Before function call")
        result = func(*args, **kwargs)
        print("After function call")
        return result * 2  # 修改返回值
    return wrapper

@decorator
def add(a, b):
    return a + b

print(add(2, 3))  # 输出: 10
```

输出：
```
Before function call
After function call
10
```

在这个例子中，装饰器修改了 `add` 函数的返回值，使得结果加倍。

#### 5. 使用 `functools.wraps` 保留原函数信息

当我们使用装饰器时，装饰器会覆盖原始函数的一些属性，比如函数名、文档字符串（`__doc__`）等。为了解决这个问题，`functools.wraps` 可以帮助我们保留这些原始属性。

```python
from functools import wraps

def decorator(func):
    @wraps(func)  # 保留原函数的属性
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

print(greet.__name__)  # 输出: greet
print(greet.__doc__)  # 输出: This is a greeting function.
```

如果没有使用 `wraps`，`greet.__name__` 会返回 `wrapper`，而不是 `greet`，并且 `greet.__doc__` 会变成 `None`。使用 `wraps` 可以确保这些属性不会丢失。

#### 6. 装饰器带有参数

有时你可能需要创建一个能够接受参数的装饰器。例如，想要根据不同的条件改变装饰器的行为。可以通过在装饰器外面再定义一个函数来实现。

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

输出：
```
Decorator argument: Hello
Hello, Alice!
```

在这个例子中，`decorator_with_args` 是一个接受参数的装饰器，它返回一个装饰器，然后再返回最终的包装函数。

#### 7. 常见装饰器应用

装饰器在实际项目中有很多常见的应用，以下是几个常见的示例：

- **缓存装饰器（Memoization）**：缓存函数结果，避免重复计算。

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

print(slow_function(2))  # 计算并缓存
print(slow_function(2))  # 直接返回缓存结果
```

- **权限验证**：检查用户是否具有执行某些操作的权限。

```python
def requires_permission(func):
    def wrapper(user, *args, **kwargs):
        if not user.has_permission:
            raise PermissionError("User does not have permission.")
        return func(user, *args, **kwargs)
    return wrapper
```

#### 8. 总结

装饰器是 Python 中非常强大的功能，可以让你在不改变原始函数代码的情况下，动态地增加或修改函数行为。装饰器广泛应用于日志记录、缓存、权限验证等场景，帮助你编写更加清晰、优雅且高效的代码。

掌握装饰器的定义与应用方式，能够让你在 Python 编程中更加得心应手，写出更加灵活且具有复用性的代码。

如果你对装饰器有任何问题，或者需要了解更复杂的用法，随时欢迎提问！

---  
阅读更多内容：[https://ermao.net](https://ermao.net)