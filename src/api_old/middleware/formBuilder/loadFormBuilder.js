/**
 *
 * @param objRepo
 * @returns {function(*, *, *): Promise<any> | Promise<ResultType> | Promise<ResultType>}
 */
const loadForms = (objRepo) => {
  const formsModel = objRepo.formBuilderData;
  return (req, res, next) => {
    return formsModel
      .find({})
      .then((settings) => {
        res.locals.forms = settings;
        return next();
      })
      .catch(next);
  };
};
export default loadForms;
