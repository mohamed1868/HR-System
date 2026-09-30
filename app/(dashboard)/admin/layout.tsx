interface ILayoutPage {
  children: React.ReactNode;
}

const Layout = ({ children }: ILayoutPage) => {
  return<>
  <h1>dfdf</h1>
  <div>{children}</div>
  </> 
};

export default Layout;
