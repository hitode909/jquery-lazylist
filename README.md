# jquery-lazylist

jquery-lazylist is a lazy list built on jQuery Deferred.

This is useful to implement counter, fibonacci function with memoization, Ajax pager, and so on.

## Counter

```javascript
var counter = new $.LazyList(function(prev) {
    var d = $.Deferred();
    if (prev) {
        prev.promise().done(function(i) {
            if (i < 10) {
                d.resolve(i+1);
            } else {
                d.reject();
            }
        });
    } else {
        d.resolve(0);
    }
    return d;
});

for (var i = 0; i <= 13; i++) {
    counter.promise().done(function(j) {
        console.log(j);
    }).fail(function() {
        console.log('failed');
    });
    counter = counter.next();
}
```

### Output

```
0
1
2
3
4
5
6
7
8
9
10
failed
```

## Fibonacci with memoization

```javascript
var fib = new $.LazyList(function(prev) {
    console.log('generate');
    var dfd = $.Deferred();
    if (prev && prev.prev()) {
        prev.prev().promise().done(function(a) {
            prev.promise().done(function(b) {
                console.log(a + ' + ' + b + ' = ' + (a+b));
                dfd.resolve(a + b);
            });
        });
    } else if (prev) {
        dfd.resolve(1);
    } else {
        dfd.resolve(0);
    }
    return dfd;
});
for (var i = 0; i <= 10; i++) with({i: i}) {
    fib.promise().done(function(v) {
        console.log('fib(' + i + ') = ' + v);
    });
    fib = fib.next();
}
// re-culculate from 0
fib = fib.root();
for (var i = 0; i <= 10; i++) with({i: i}) {
    fib.promise().done(function(v) {
        console.log('fib(' + i + ') = ' + v);
    });
    fib = fib.next();
}
```

### Output

```
generate
fib(0) = 0
generate
fib(1) = 1
generate
0 + 1 = 1
fib(2) = 1
generate
1 + 1 = 2
fib(3) = 2
generate
1 + 2 = 3
fib(4) = 3
generate
2 + 3 = 5
fib(5) = 5
generate
3 + 5 = 8
fib(6) = 8
generate
5 + 8 = 13
fib(7) = 13
generate
8 + 13 = 21
fib(8) = 21
generate
13 + 21 = 34
fib(9) = 34
generate
21 + 34 = 55
fib(10) = 55
fib(0) = 0
fib(1) = 1
fib(2) = 1
fib(3) = 2
fib(4) = 3
fib(5) = 5
fib(6) = 8
fib(7) = 13
fib(8) = 21
fib(9) = 34
fib(10) = 55
```

## Pager

```javascript
var pager = new $.LazyList(function(prev) {
    console.log('generate');
    var dfd = $.Deferred();
    var data = {};
    var get = function() {
      $.ajax({
        url: '/some/api',
        data: data,
      }).done(function(res){
        dfd.resolve(res);
      }).fail(function(error) {
        dfd.reject(error);
      });
    };

    if (prev) {
        prev.promise().done(function(res) {
            data.until = res.max_id;
            get();
        });
    } else {
        get();
    }

    return dfd;
});
```

## Usage
```javascript
// get first page
pager.resolve().done(function(page1) {
  console.log(page1);
});

// get first page(cached)
pager.resolve().done(function(page1) {
  console.log(page1);
});

// get fifth page
pager.next().next().next().next().resolve().done(function(page5) {
  console.log(page5);
});
```
