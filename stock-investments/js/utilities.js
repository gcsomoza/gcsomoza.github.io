function calculateBuyingFee(buyingAmount) {
  const brokerCommisionPercent = 0.25;
  const securitiesClearingCorporationFeePercent = 0.01;
  const valueAddedTaxPercent = 12.0;

  const securitiesClearingCorporationFee = parseFloat((buyingAmount * (securitiesClearingCorporationFeePercent / 100)).toFixed(2))

  let brokerCommision = parseFloat((buyingAmount * (brokerCommisionPercent / 100)).toFixed(2))
  brokerCommision = (brokerCommision < 20) ? 20 : brokerCommision
  
  const valueAddedTax = parseFloat((brokerCommision * (valueAddedTaxPercent / 100)).toFixed(2))
  
  const fee = parseFloat((securitiesClearingCorporationFee + brokerCommision + valueAddedTax).toFixed(2))
  
  return fee
};

function calculateSellingFee(sellingAmount) {
  if (sellingAmount <= 0) return 0.0;
  
  const brokerCommisionPercent = 0.25;
  const securitiesClearingCorporationFeePercent = 0.01;
  const valueAddedTaxPercent = 12.0;
  const salesTaxPercent = 0.6;

  const securitiesClearingCorporationFee = parseFloat((sellingAmount * (securitiesClearingCorporationFeePercent / 100)).toFixed(2))
  
  let brokerCommision = parseFloat((sellingAmount * (brokerCommisionPercent / 100)).toFixed(2))
  brokerCommision = (brokerCommision < 20) ? 20 : brokerCommision
  
  const valueAddedTax = parseFloat((brokerCommision * (valueAddedTaxPercent / 100)).toFixed(2))
  
  const salesTax = parseFloat((sellingAmount * (salesTaxPercent / 100)).toFixed(2))
  
  const fee = parseFloat((securitiesClearingCorporationFee + brokerCommision + valueAddedTax + salesTax).toFixed(2))
  
  return fee
};

function calculateProfit(params) {
  const parameters = {
    buyingQty: 0,
    buyingPrice: 0,
    sellingQty: 0,
    sellingPrice: 0
  }
  for(let parameter in params) {
    if(params.hasOwnProperty(parameter)) {
      parameters[parameter] = params[parameter];
    }
  }
  
  const buyingTotal = parseFloat((parameters.buyingQty * parameters.buyingPrice).toFixed(2));
  const buyingFee = calculateBuyingFee(buyingTotal);
  
  const sellingTotal = parseFloat((parameters.sellingQty * parameters.sellingPrice).toFixed(2));
  const sellingFee = calculateSellingFee(sellingTotal);
  
  const totalFee = parseFloat((buyingFee + sellingFee).toFixed(2));
  const profit = parseFloat((sellingTotal - buyingTotal - totalFee).toFixed(2));
  
  return {
    buyingTotal, buyingFee, sellingTotal, sellingFee, profit
  }
};

function parseCSV(data) {
  const csv = [];
  let lines = data.split(/\r?\n|\r/);
  for(let i = 0; i < lines.length; i++) {
    const cells = lines[i].split(',');
    csv.push(cells);
  }
  return csv;
};

function parseTextarea(content) {
  const lines = content.split(/\r?\n|\r/)
  const linesLength = lines.length
  let columns = []
  let rows = []
  
  let isColumnCheck = true
  let previousColumn = ''
  let columnsLength = 0
  let row = []
  for(let i = 0; i < linesLength; i++) {
    const line = lines[i]
    const column = (isColumnCheck) ? line.replace(`${previousColumn}\t`, '') : ''
    if(isColumnCheck && previousColumn == column) {
      isColumnCheck = false
      columnsLength = columns.length
    }
    else {
      if(isColumnCheck) {
        columns.push(column)
        previousColumn = column
      }
      else {
        // Row processing
        if(row.length == columns.length) {
          rows.push(row)
          row = []
        }
        row.push(line)
      }
    }
  }
  rows.push(row)
  
  return { columns, rows }
}

function getInvestmentsData() {
  return new Promise((resolve, reject) => {
    $.ajax({
        url: 'data/investments.csv',
        dataType: 'text'
    })
    .done(function(data) {
        resolve(data);
    })
    .fail(function(error) {
        reject(error);
    })
  });
}