import React, {FunctionComponent} from 'react';

import './Home.css';

export const Home: FunctionComponent = (): JSX.Element =>
    <div className={"home"}>
        <div className={"tagline"}>
            Tea Ranker is a website created by <a href={"/about-us"}>three friends</a> to figure out <a href={"/tea-masterlist"}>which tea</a> offered by their fave local tea shop is <a href={"/rankings"}>the best</a>.
        </div>
        <div className={"addendum"}>
            No easy task, we know.
        </div>
    </div>;