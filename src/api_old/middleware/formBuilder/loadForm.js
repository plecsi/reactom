const loadForm = (objRepo) => {
  return (req, res, next) => {

    res.locals.FORMS = objRepo.formBuilder.find(e=> e._id === req.params.id) || [];

    if(typeof res.locals.FORMS === 'undefined') {
      //404
      return res.json({"error": "Form not found"});
    }

    return next();
  }
}

export default loadForm;