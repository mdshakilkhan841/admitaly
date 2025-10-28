import React from "react";

const ApplicationLayout = ({
    children,
}: Readonly<{ children: React.ReactNode }>) => {
    return <div>{children}</div>;
};

export default ApplicationLayout;
