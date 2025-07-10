/**
 *
 * @param objRepo
 * @returns {function(*, *, *): Promise<any> | Promise<ResultType> | Promise<ResultType>}
 */
const loadDatas = (objRepo) => {
  const settingsModel = objRepo.entityData;

  return (req, res, next) => {
    return settingsModel
      .find({})
      .then((settings) => {
        res.locals.settings = settings;
        return next();
      })
      .catch(next);
  };
};
export default loadDatas;
