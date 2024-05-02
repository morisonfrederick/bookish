


const userLogin = (req, res, next) => {
    try{
      console.log(req.session.user);
      if (!req.session.user) {
      res.redirect("/home/login");
    } else {
      next(); 
    }
    }
    catch (error) {
      console.log(error.message);
  } 
  };
  
  const adminLogin = (req, res, next) => {
    try{
      if (!req.session.isadmin) {
        res.redirect("/admin/login");
      } else {
        next(); 
      }
    }catch (error) {
      console.log(error.message); 
  }; 
    
  };

  const isnotAdmin =(req,res,next)=>{
    try{
      if(req.session.isadmin){
        res.redirect("/admin")
      }
      else{
        next()
      }
    }
    catch(err){
      console.log(err)
    }
  }

  module.exports = {
    userLogin,
    adminLogin,
    isnotAdmin
    }
  
  