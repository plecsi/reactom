/**
 *
 * @param objRepo
 * @param view
 * @returns {(function(*, *, *): void)|*}
 */

const render = (objRepo, view) => {
  return (req, res, next) => {
   /* console.log('render middleware objRepo', objRepo);
    console.log('render middleware res.locals', res.locals);
    console.log('render middleware view', view);*/
    res.json(res.locals);
  };
};

export default render;
