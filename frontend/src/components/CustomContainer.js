import React from 'react';
import { Container} from 'react-bootstrap';
import '../styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const SIZE = ['myContainer--small','myContainer--medium','myContainer--large']

export const CustomContainer = ({
    children,
    containerSize,
}) => {
    const checkContainerSize = SIZE.includes(containerSize) ? containerSize : 'myContainer--large';

    return (
        <div className={`myContainer ${checkContainerSize}`}>{children}</div>
    )
}

