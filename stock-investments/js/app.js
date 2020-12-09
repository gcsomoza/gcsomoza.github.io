const app = new Vue({
  el: '#investments',
  data() {
    return {
      stocks: [
        { 
          symbol: '', 
          buyQty: 0, 
          buyPrice: 0.0,
          buyTotal: 0.0,
          buyFee: 0.0,
          sellQty: 0, 
          sellPrice: 0.0,
          sellTotal: 0.0,
          sellFee: 0.0,
          profit: 0 
        }
      ]
    }
  },
  async mounted() {
    let csvData = await getInvestmentsData();
    let investments = parseCSV(csvData);
    
    /* csv content
      0: "Symbol"
      1: "Quantity"
      2: "Buy Price"
      3: "Buy Date"
      4: "Status"
    */
    const stocks = [];
    for(let i = 1; i < investments.length; i++) {
      const investment = investments[i];
      
      if(investment[4] == "Sold") {
        continue;
      }
      
      const profit = calculateProfit({
        buyingQty: investment[1],
        buyingPrice: investment[2],
      });
      stocks.push({
          symbol: investment[0], 
          buyQty: parseInt(investment[1]),
          buyPrice: parseFloat(investment[2]),
          buyTotal: profit.buyingTotal,
          buyFee: profit.buyingFee,
          sellQty: 0,
          sellPrice: 0.0,
          sellTotal: profit.sellingTotal,
          sellFee: profit.sellingFee,
          profit: profit.profit
      })
    }
    if(investments.length > 1) {
      this.stocks = stocks;
    }
    
    /* Trigger textarea onchange event programatically
    var el = document.getElementById('txtarea');
    var ev = new Event('change');
    el.dispatchEvent(ev);
    //*/
  },
  methods: {
    textareaChangeHandler(e) {
      const data = parseTextarea(e.target.value);
      const companies = data.rows;
      
      /* companies content
        0: "Stock"
        1: "Company"
        2: "Bid Qty"
        3: "Bid Price"
        4: "Ask Price"
        5: "Ask Qty"
        6: "Last Price"
        7: "Change %"
      */
      const stocks = JSON.parse(JSON.stringify(this.stocks));
      for(let i = 0; i < stocks.length; i++) {
        const stock = stocks[i];
        let company = null;
        for(let j = 0; j < companies.length; j++) {
          console.log(stock.symbol == companies[j][0]);
          if(stock.symbol == companies[j][0]) {
            company = companies[j];
            break;
          }
        }
        if(company != null) {
          const profit = calculateProfit({
            buyingQty: stock.buyQty,
            buyingPrice: stock.buyPrice,
            sellingQty: stock.buyQty,
            sellingPrice: parseFloat(company[3]),
          });
          stock.sellQty = stock.buyQty;
          stock.sellPrice = parseFloat(company[3]);
          stock.sellTotal = profit.sellingTotal;
          stock.sellFee = profit.sellingFee;
          stock.profit = profit.profit;
          
          stocks[i] = stock;
        }
      }
      this.stocks = stocks;
    }
  },
  computed: {
    totalCash() {
      let totalCash = 0;
      for(let i = 0; i < this.stocks.length; i++) {
        const stock = this.stocks[i];
        totalCash += stock.sellTotal - stock.sellFee;
      }
      return totalCash;
    }
  }
});