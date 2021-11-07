import React from 'react'

export default function Footer() {
    return (
        <footer>
            <div className="about">
                <div className="container">
                    <div className="row">
                        <hr className="offset-md" />

                        <div className="col-xs-6 col-sm-3">
                            <div className="item">
                                <i className="ion-ios-telephone-outline"></i>
                                <h1>24/7 free <br /> <span>support</span></h1>
                            </div>
                        </div>
                        <div className="col-xs-6 col-sm-3">
                            <div className="item">
                                <i className="ion-ios-star-outline"></i>
                                <h1>Low price <br /> <span>guarantee</span></h1>
                            </div>
                        </div>
                        <div className="col-xs-6 col-sm-3">
                            <div className="item">
                                <i className="ion-ios-gear-outline"></i>
                                <h1> Manufacturer’s <br /> <span>warranty</span></h1>
                            </div>
                        </div>
                        <div className="col-xs-6 col-sm-3">
                            <div className="item">
                                <i className="ion-ios-loop"></i>
                                <h1> Full refund <br /> <span>guarantee</span> </h1>
                            </div>
                        </div>

                        <hr className="offset-md" />
                    </div>
                </div>
            </div>
        </footer>
    )
}
