/**
 *
 * @param objRepo
 * @returns {function(*, *, *): Promise<any> | Promise<ResultType> | Promise<ResultType>}
 */
const loadUsers = (objRepo) => {
  const usersModel = objRepo.userData;

  return (req, res, next) => {
    return usersModel
      .find({})
      .then((users) => {
        res.locals.users = users;
        return next();
      })
      .catch(next);
  };
};
export default loadUsers;
