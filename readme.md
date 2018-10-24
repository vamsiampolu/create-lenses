This project is inspired by:

[Thinking in Ramda Lenses](http://randycoulman.com/blog/2016/07/12/thinking-in-ramda-lenses/)
[Zooming in to Lenses](https://blog.codecentric.de/en/2018/02/zooming-lenses-lenses-js-land/)
[Ramda](https://ramdajs.com/docs/)

This library provides the ability to create lenses over objects only
One can use the functions `prop` and `path` to create getters over `objects` and the functions
`assoc` and `assocPath` to create getters over them.

The functions `lens` , `lensProp` and `lensPath` can be used to create lenses with the latter two 
being conveniance options.

Once a lens has been created one can use the functions `view`, `set` and `over` to get, set and update the value of a property
immutably
