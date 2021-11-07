import React, { useEffect, useState } from "react";
import { getWeb3 } from "./utils.js";
import { newKitFromWeb3 } from "@celo/contractkit";
import BigNumber from "bignumber.js";
import MarketPlace from "./contract/marketplace.abi.json";
import Erc20Abi from "./contract/erc20.abi.json";
import { useToasts } from "react-toast-notifications";
//import Loading from "./Loading";
import Nav from "./components/Nav.js";
import Footer from "./components/Footer.js";

const ERC20_DECIMALS = 18;
const contractAddress = "0x780C488723B3a65402938dBAE119db58aA05b415";
const cUSDContractAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";

let kit;

function App() {
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [contract, setContract] = useState(undefined);
  const [products, setProducts] = useState([]);
  const [balance, setBalance] = useState(0);
  const [inputs, setInputs] = useState({
    productName: "",
    productDescription: "",
    productLocation: "",
    productImage: "",
    productPrice: 0
  });
  const { addToast } = useToasts();

  useEffect(() => {
    const init = async () => {
      const web3 = await getWeb3();

      kit = newKitFromWeb3(web3);

      const accounts = await kit.web3.eth.getAccounts();

      const contract = new kit.web3.eth.Contract(MarketPlace, contractAddress);

      const balance = await kit.getTotalBalance(accounts[0]);
      const USDBalance = balance.cUSD.shiftedBy(-ERC20_DECIMALS).toFixed(2);

      setWeb3(web3);
      setAccounts(accounts);
      setContract(contract);
      setBalance(USDBalance);
    };
    init();
    window.celo.on("accountsChanged", (accounts) => {
      setAccounts(accounts);
    });
  }, []);

  const isReady = () => {
    return (
      typeof contract !== "undefined" &&
      typeof web3 !== "undefined" &&
      typeof accounts !== "undefined"
    );
  };

  useEffect(() => {
    // eslint-disable-next-line
    if (isReady()) {
      updateProduct();
    }
    // eslint-disable-next-line
  }, [accounts, contract, web3]);

  function onChange(name, e) {
    setInputs({
      ...inputs,
      [name]: e.target.value,
    });
  }

  async function approve(_price) {
    const new_amount = new BigNumber(_price).shiftedBy(ERC20_DECIMALS);
    const _amount = new_amount.toString();
    const cUSDContract = new kit.web3.eth.Contract(
      Erc20Abi,
      cUSDContractAddress
    );
    const result = await cUSDContract.methods
      .approve(contractAddress, _amount)
      .send({ from: accounts[0] });
    return result;
  }

  async function createProduct(e) {
    // Another Possible Error
    addToast("⌛ Creating product", { appearance: "success", autoDismiss: false });
    e.preventDefault();
    const name = e.target.elements[0].value;
    const image = e.target.elements[1].value;
    const location = e.target.elements[2].value;
    const price = e.target.elements[3].value;
    const description = e.target.elements[4].value;

    try {
      await contract.methods
        .writeProduct(name, image, description, location, price)
        .send({ from: accounts[0] });
      addToast("🎉 Product created Successful", { appearance: "success", autoDismiss: true });
      await updateProduct();
    } catch (error) {
      addToast(`⚠️ ${error}`, { appearance: "error", autoDismiss: true });
    }

    setInputs({
      productDescription: "",
      productLocation: "",
      productImage: "",
      productName: "",
      productPrice: ""
    });
  }

  async function updateProduct() {
    const _productLength = await contract.methods
      .getProductsLength()
      .call();

    const products = [];
    for (let i = 0; i < _productLength; i++) {
      const [product] = await Promise.all([
        contract.methods.readProduct(i).call(),
      ]);
      products.push({ ...product });
    }
    setProducts(products);
  }

  async function buy(id, amount) {
    addToast("⌛ Sending transaction... ", { appearance: "success", autoDismiss: false });
    try {
      await approve(amount);
      await contract.methods.buyProduct(id).send({ from: accounts[0] });
      addToast("🎉 Purchased Successful", { appearance: "success", autoDismiss: true });
      await updateProduct();
    } catch (error) {
      addToast(`⚠️ ${error}`, { appearance: "error", autoDismiss: true });
    }
  }

  async function like(event, id) {
    console.log(id);
    event.preventDefault();
    addToast("⌛ Sending... ", { appearance: "success", autoDismiss: false });
    try {
      await contract.methods.likeProduct(id).send({ from: accounts[0] });
      addToast("🎉 Like Successful", { appearance: "success", autoDismiss: true });
      await updateProduct();
    } catch (error) {
      addToast(`⚠️ ${error}`, { appearance: "error", autoDismiss: true });
    }
  }





  return (
    <div className="App">
      <Nav balance={balance} account={accounts} />
      <hr className="offset-lg"></hr>
      <div className="container">
        <div className="row">
          <div className="col-sm-3 filter">
            <h2>Add new Product</h2>
            <form onSubmit={(e) => createProduct(e)}>
              <input name="name" id="name" placeholder="Product Name" className="form-control" value={inputs.productName}
                onChange={(e) => onChange("productName", e)} /><br />
              <input name="image" id="image" placeholder="Product Image" className="form-control" value={inputs.productImage}
                onChange={(e) => onChange("productImage", e)} /><br />
              <input name="location" id="location" placeholder="Product Location" className="form-control" value={inputs.productLocation}
                onChange={(e) => onChange("productLocation", e)} /><br />
              <input name="price" id="price" type="number" placeholder="Product Price" className="form-control" value={inputs.productPrice}
                onChange={(e) => onChange("productPrice", e)} /><br />
              <textarea placeholder="Product Description" id="description" className="form-control" value={inputs.productDescription}
                onChange={(e) => onChange("productDescription", e)}></textarea><br />
              <button className="btn btn-primary btn-rounded btn-sm">Add Product</button>
            </form>
          </div>

          <div className="col-sm-9 products">
            <h2>Products</h2>
            <div className="row">

              {products.map((product, index) => (
                <div className="col-sm-6 col-md-4 product" key={index}>
                  <a href="#favorites" className="favorites" data-favorite="inactive" onClick={(e) => like(e, index)}><i className="ion-ios-heart-outline"></i></a>
                  <a href="./"><img src={product[2]} alt="HP Chromebook 11" /></a>

                  <div className="content">
                    <h1 className="h4">{product[1]}</h1>
                    <p className="price">{product[5]}cUSD</p>
                    <p>{product[3]}cUSD</p>
                    <label>{product[4]}</label>

                    <a className="btn btn-link" href="#sold">{product[6]} Sold</a>
                    <a className="btn btn-link" href="#sold">{product[7]} Likes</a>
                    <button className="btn btn-primary btn-rounded btn-sm" onClick={() => buy(index, product[5])}> <i className="ion-bag"></i> Buy</button>
                  </div>
                </div>
              ))}


            </div>

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
