// ***validation helpers BEGIN***
const isStringEmpty = str => {
  if (str.trim() === '') {
    return true;
  }
  else {
    return false;
  }
}

const isEmail = email => {
  const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(emailRegEx)) {
    return true
  } else {
    return false
  }
}

exports.doesAuthRequestPassValidation = authRequest => {
  let errors = {};  
  // validate each field to make sure newUser properties are all populated...
  if (isStringEmpty(authRequest.email)) {
    errors.email = 'Email field must be populated'
  } else if (!isEmail(authRequest.email)) {
    errors.email = 'Must be a valid email address'
  }

  if (isStringEmpty(authRequest.password)) errors.password = 'Password field must be populated'
  if (authRequest.hasOwnProperty('confirmPassword') && authRequest.password !== authRequest.confirmPassword) errors.confirmPassword = 'Password fields must match'
  if (authRequest.hasOwnProperty('username') && isStringEmpty(authRequest.username)) errors.username = 'Username field must be populated'

  // errors obj must be empty in order to proceed (otherwise we have an error)
  if (Object.keys(errors).length > 0) return {doesPass: false, errors}
  else return {doesPass: true}
}


exports.cleanUserDetails = data => {
  // take in bio, location, website
  let userDetails = {};

  if (!isStringEmpty(data.bio)) userDetails.bio = data.bio;
  if (!isStringEmpty(data.website)) {
    // add http to website if not included by user
    if (data.website.trim().substring(0, 4) !== 'http') {
      // if no http -> add to it
      userDetails.website = `http://${data.website.trim()}`;
    }
    else {
      userDetails.website = data.website;
    }
  }
  if (!isStringEmpty(data.location)) userDetails.location = data.location;

  return userDetails;
}

// ***validation helpers END***