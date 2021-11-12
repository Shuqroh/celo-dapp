import React from "react";

export default function Nav({ account, balance }) {
  return (
    <nav className="navbar navbar-default">
      <div className="container">
        <div className="navbar-header">
          <button
            type="button"
            className="navbar-toggle collapsed"
            data-toggle="collapse"
            data-target="#navbar"
            aria-expanded="false"
            aria-controls="navbar"
          >
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <a className="navbar-brand" href="/">
            {" "}
            <i className="ion-cube"></i> Unistore
          </a>
        </div>

        <div id="navbar" className="navbar-collapse collapse">
          <ul className="nav navbar-nav">
            <li className="active">
              <a href="/">Home</a>
            </li>
          </ul>
          <ul className="nav navbar-nav navbar-right">
            <li>
              <a href="#account">
                {" "}
                <i className="ion-android-person"></i> Hello, {account}{" "}
              </a>
            </li>
            <li>
              <a href="#balance"> {balance}cUSD</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
