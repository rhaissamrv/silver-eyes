import './Defaults.css'

import React from 'react'

function DemoText() {
    return (
        <div>
            <div className="narrow-column">
                <h1>Headline 1</h1>
                <h2>Headline 2</h2>
                <h3>Headline 3</h3>
                <h4>Headline 4</h4>
                <p>
                    Cras justo odio, dapibus ac facilisis in, egestas eget quam.
                    Cras mattis consectetur purus sit amet fermentum. Cras
                    mattis consectetur purus sit amet fermentum. Aenean lacinia
                    bibendum nulla sed consectetur. Donec ullamcorper nulla non
                    metus auctor fringilla.
                </p>
                <h3>Headline 3</h3>
                {/* <aside>Aside: Cras justo odio, dapibus ac facilisis.</aside> */}
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Morbi leo risus, porta ac consectetur ac, vestibulum at
                    eros.
                    <em>Vestibulum id ligula porta felis euismod semper.</em>
                    <b>Vivamus sagittis lacus</b> vel augue laoreet rutrum
                    faucibus dolor auctor. Donec sed odio dui. Donec sed odio
                    dui. Nulla vitae elit libero, a pharetra augue. Maecenas
                    faucibus mollis interdum. Cras justo odio, dapibus ac
                    facilisis in, egestas eget quam. Cras mattis consectetur
                    purus sit amet fermentum. Cras mattis consectetur purus sit
                    amet fermentum. Aenean lacinia bibendum nulla sed
                    consectetur. Donec ullamcorper nulla non metus auctor
                    fringilla. Cras justo odio, dapibus ac facilisis in, egestas
                    eget quam. Cras mattis consectetur purus sit amet fermentum.
                    Cras mattis consectetur purus sit amet fermentum. Aenean
                    lacinia bibendum nulla sed consectetur. Donec ullamcorper
                    nulla non metus auctor fringilla.
                </p>

                <h4>Headline 4</h4>
                <img
                    src=""
                    width="200"
                    height="200"
                    alt="placeholder"
                    className="img-left"
                    border="1px"
                ></img>

                <button className="featured">Feature</button>
                <button className="secondary">Button</button>
                <button disabled>Inactive</button>
                <p>
                    Distance: <span className="plex">20.2 km</span>
                    <br />
                    Temperature: <span className="plex">28.8&deg; Celcius</span>
                    <br />
                    Es, <span className="plex">20.2 meters</span> nascetur
                    ridiculus mus. Cum sociis natoque penatibus et magnis dis
                </p>
                {/* <img src="" width="200" height="200" alt="placeholder" className="img-right"></img> */}
                <p>
                    Etiam porta sem malesuada magna mollis euismod. Aenean
                    lacinia bibendum nulla sed consectetur. Cum sociis natoque
                    penatibus et magnis dis parturient montes, nascetur
                    ridiculus mus. Cum sociis natoque penatibus et magnis dis
                    parturient montes, nascetur ridiculus mus. Donec id elit non
                    mi porta gravida at eget metus.
                </p>
            </div>
        </div>
    )
}

export default DemoText
