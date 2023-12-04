import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import axios from "axios";

const ProductlyCart = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  useEffect(() => {
    // Fetch products from the fake API (fakestoreapi)
    axios
      .get("https://fakestoreapi.com/products")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  const addToCart = (product) => {
    // Check if the product is already in the cart
    const existingProduct = cart.find((item) => item.id === product.id);

    if (existingProduct) {
      // If the product is already in the cart, update the quantity
      const updatedCart = cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      setCart(updatedCart);
    } else {
      // If the product is not in the cart, add it with quantity 1
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (index) => {
    const updatedCart = [...cart];
    const itemToRemove = updatedCart[index];

    if (itemToRemove.quantity > 1) {
      // If the quantity is more than 1, decrease the quantity
      updatedCart[index] = {
        ...itemToRemove,
        quantity: itemToRemove.quantity - 1,
      };
    } else {
      // If the quantity is 1, remove the item from the cart
      updatedCart.splice(index, 1);
    }

    setCart(updatedCart);
  };

  const openCartDrawer = () => {
    setCartDrawerOpen(true);
  };

  const closeCartDrawer = () => {
    setCartDrawerOpen(false);
  };

  const getTotalPrice = () => {
    return cart
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  return (
    <Container>
      <AppBar position="sticky">
        <Toolbar style={{ justifyContent: "space-between" }}>
          <Typography variant="h6">Productly Cart</Typography>
          <IconButton color="inherit" onClick={openCartDrawer}>
            <Badge badgeContent={cart.length} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={cartDrawerOpen} onClose={closeCartDrawer}>
        <List>
          {cart.map((item, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={item.title}
                secondary={`$${item.price.toFixed(2)} | Quantity: ${
                  item.quantity
                }`}
              />
              <Button color="primary" onClick={() => addToCart(item)}>
                +
              </Button>
              <Button color="secondary" onClick={() => removeFromCart(index)}>
                -
              </Button>
              <Button color="secondary" onClick={() => removeFromCart(index)}>
                Remove
              </Button>
            </ListItem>
          ))}
          <ListItem>
            <ListItemText primary={`Total: $${getTotalPrice()}`} />
          </ListItem>
        </List>
      </Drawer>

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <img
                  src={product.image}
                  alt={product.title}
                  style={{ maxWidth: "100%" }}
                />
                <Typography variant="h5" component="div">
                  {product.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {product.description}
                </Typography>
                <Typography variant="h6" color="primary">
                  ${product.price.toFixed(2)}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ProductlyCart;
