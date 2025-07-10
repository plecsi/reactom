/**
 *
 * @param objRepo
 * @param view
 * @returns {(function(*, *, *): void)|*}
 */

const render = (objRepo, view) => {
    return (req, res, next) => {
        console.log('render middleware', objRepo, res.locals, view);
         res.json(res.locals);
    }
}

export default render;