const saveForm = (objRepo) => {
  console.log('Request:');

  return async function (req, res, next) {
    const formsModel = objRepo.formBuilderData;

    if (req.method !== 'POST' || !req.body) {
      return next();
    }

    try {
      // Itt POST, útvonal, body garantáltan van (a router miatt!)
      console.log('saveForm middleware initialized with model:', formsModel);

      const savedForm = await formsModel.create(req.body);
      res.locals.forms = savedForm;
      console.log('Form saved successfully:', savedForm);

      // Ha ez a végső feldolgozás, küldd a választ ki itt!
      // res.status(201).json(savedForm);

      // Ha még jön middleware (pl. renderMw), csak tovább engedd:
      return next();
    } catch (error) {
      res.locals.error = error;
      console.error('Error saving form:', error);
      return next(error);
    }
  };
};

export default saveForm;
