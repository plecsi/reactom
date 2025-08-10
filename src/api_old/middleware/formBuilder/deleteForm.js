const updateForm = (objRepo) => {
  console.log('Request: delete', objRepo);

  return async function (req, res, next) {
    const formsModel = objRepo.formBuilderData;
    console.log('Request:', req.params.id);

    try {
      const deleteForm = await formsModel.findOne({ _id: req.params.id });
      if (!deleteForm) {
        return res.status(404).json({
          success: false,
          message: 'Form not found',
        });
      }
      await formsModel.deleteOne({ _id: req.params.id });

      res.locals.forms = deleteForm

      return next();
    } catch (err) {
      console.error('Error in updateForm middleware:', err);
      res.locals.error = err;
      return next(err);
    }
  };
};

export default updateForm;
