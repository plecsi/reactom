const loadData = (objRepo) => {
    return (req, res, next) => {

        res.locals.DATAS = objRepo.entityData.find(e=> e._id === req.params.id) || [];

        if(typeof res.locals.DATAS === 'undefined') {
            //404
            return res.redirect('/')
        }

        return next();
    }
}

export default loadData;