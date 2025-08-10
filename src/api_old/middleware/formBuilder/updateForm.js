const updateForm = (objRepo) => {
  console.log('Request:', objRepo);

  return async function (req, res, next) {
    const formsModel = objRepo.formBuilderData;
    console.log('Request:',  req.params.id);

    try {
      const updateForm = await formsModel.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true, runValidators: true }
      );

      if (!updateForm) {
        res.locals.error = "Form not found";
        return next();
      }

      res.locals = updateForm;
      console.log('Form update successfully:', updateForm);

      return next();


    }catch (err) {
      console.error('Error in updateForm middleware:', err);
      res.locals.error = err
      return next(err);
    }
  };
};

export default updateForm;
