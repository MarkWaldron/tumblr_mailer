var fs = require('fs');

var csvFile = fs.readFileSync('friend_list.csv', 'utf-8');

var csvParse = function(file){
  var csvArr = file.split('\n');
  csvArr.shift();
  for (i in csvArr){
    csvArr[i] = csvArr[i].split(',');
  };
  var contactArray = [];
  function person(firstName, lastName, numMonthsSinceContact, email){
    this.firstName = firstName;
    this.lastName = lastName;
    this.numMonthsSinceContact = numMonthsSinceContact;
    this.email = email;
  };

  for (i in csvArr){
    var entry = new person(csvArr[i][0], csvArr[i][1], csvArr[i][2], csvArr[i][3]);
    contactArray.push(entry);
  };
  //clears null entry
  contactArray.pop();
  return contactArray;
};
csv_file = csvParse(csvFile);
console.log(csv_file);
