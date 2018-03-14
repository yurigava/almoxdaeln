module.exports = exports = function findNotContainedAInB(A, B) {
  var missingElements = [];
  A.forEach(function(elem) {
    if(!B.includes(elem))
      missingElements.push(elem);
  });
  return missingElements;
}
