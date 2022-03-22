App = {
    contracts : {},
    load: async ()=> {
        console.log('App loading done')
        await App.loadWeb3()
        await App.loadAccount()
        await App.loadContract()
        await App.render()
    },
    loadWeb3: async () => {
        if (typeof web3 !== 'undefined') {
          App.web3Provider = web3.currentProvider
          web3 = new Web3(web3.currentProvider)
        } else {
          window.alert("Please connect to Metamask.")
        }
        // Modern dapp browsers...
        if (window.ethereum) {
          window.web3 = new Web3(ethereum)
          try {
            // Request account access if needed
            await ethereum.enable()
            // Acccounts now exposed
            web3.eth.sendTransaction({/* ... */})
          } catch (error) {
            // User denied account access...
          }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
          App.web3Provider = web3.currentProvider
          window.web3 = new Web3(web3.currentProvider)
          // Acccounts always exposed
          web3.eth.sendTransaction({/* ... */})
        }
        // Non-dapp browsers...
        else {
          console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
      },

      loadAccount: async () => {
        // Set the current blockchain account
       
        web3.eth.defaultAccount = web3.eth.accounts[0];
        
        App.account = web3.eth.defaultAccount;
        
       console.log(web3.eth.defaultAccount);
       
      },
    
      loadContract: async () => {
        // Create a JavaScript version of the smart contract
        //fetch smartcontract json file
        const todoList = await $.getJSON('TodoList.json')
        //console.log(JSON.stringify(todoList))
        
        App.contracts.TodoList = TruffleContract(todoList)
        
        App.contracts.TodoList.setProvider(App.web3Provider)
    
        // Hydrate the smart contract with values from the blockchain
        App.todoList = await App.contracts.TodoList.deployed()
        //console.log(`TODO List ${JSON.stringify(App.todoList)}`)
      },
      render : async ()=> {
          
        document.getElementById("account").innerHTML =  App.account
      }
    
}
    $(()=> {
        $(window).load(()=> {
            App.load()
        })
    })
    
