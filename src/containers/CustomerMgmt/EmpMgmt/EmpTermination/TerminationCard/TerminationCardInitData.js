let d = new Date(),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

if (month.length < 2) 
      month = '0' + month;
if (day.length < 2) 
      day = '0' + day;
  
const date = [year, month, day].join('-');

export const InitData={
      terminationDate:  date,
      terminationType: 'NOTIFIED_SUPERIORS',
      terminationReason: ''
}

export const RequiredFields= ['terminationDate','terminationType','terminationReason'];