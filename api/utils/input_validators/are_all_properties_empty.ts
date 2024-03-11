function areAllPropertiesEmpty(obj) {
  for (let key in obj) {
    if (obj.hasOwnProperty(key) && obj[key] !== '') {
      return false;
    }
  }
  return true;
}

export default areAllPropertiesEmpty;
