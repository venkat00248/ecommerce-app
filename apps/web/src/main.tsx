import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider, useSelector } from 'react-redux';
import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ApolloClient, ApolloProvider, InMemoryCache, gql, HttpLink, useQuery } from '@apollo/client';
import './styles.css';

type Product = { id: string; name: string; description: string; price: number; category: string; imageUrl: string; inventory: number };
const fallbackProducts: Product[] = [
  { id: 'p-1', name: 'Everyday Carry Tote', description: 'A structured canvas tote for work and weekends.', price: 68, category: 'Bags', imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80', inventory: 12 },
  { id: 'p-2', name: 'Studio Headphones', description: 'Warm sound, all-day comfort, no distractions.', price: 129, category: 'Audio', imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80', inventory: 7 },
  { id: 'p-3', name: 'Ceramic Pour Over', description: 'Slow mornings, better coffee, beautifully made.', price: 42, category: 'Home', imageUrl: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=900&q=80', inventory: 19 }
];
const cartSlice = createSlice({ name: 'cart', initialState: [] as Product[], reducers: { add: (state, action: PayloadAction<Product>) => { state.push(action.payload); }, remove: (state, action: PayloadAction<string>) => { const index = state.findIndex((item) => item.id === action.payload); if (index >= 0) state.splice(index, 1); } } });
const store = configureStore({ reducer: { cart: cartSlice.reducer } });
const { add, remove } = cartSlice.actions;
const PRODUCTS = gql`query Products { products { id name description price category imageUrl inventory } }`;

function App() {
  const { data } = useQuery<{ products: Product[] }>(PRODUCTS);
  const cart = useSelector((state: { cart: Product[] }) => state.cart);
  const products = data?.products?.length ? data.products : fallbackProducts;
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  return <main><header><div className="brand">Morrow<span>.</span></div><nav><a href="#shop">Shop</a><a href="#story">Our edit</a></nav><button className="cart" onClick={() => alert(`Your bag has ${cart.length} item${cart.length === 1 ? '' : 's'}.`)}>Bag ({cart.length})</button></header><section className="hero"><p className="eyebrow">THE WEEKEND EDIT / 2026</p><h1>Objects with a<br /><em>quiet point of view.</em></h1><p className="intro">Thoughtful pieces for everyday rituals, sourced slowly and made to stay in rotation.</p><a className="jump" href="#shop">Explore the edit <span>↓</span></a></section><section id="shop" className="shop"><div className="section-head"><div><p className="eyebrow">01 / CURRENTLY IN ROTATION</p><h2>Small things,<br /><em>well chosen.</em></h2></div><p className="count">{products.length} pieces</p></div><div className="grid">{products.map((product) => <article className="product" key={product.id}><div className="image-wrap"><img src={product.imageUrl} alt={product.name} /><button onClick={() => store.dispatch(add(product))} aria-label={`Add ${product.name} to bag`}>+</button></div><div className="product-meta"><div><h3>{product.name}</h3><p>{product.description}</p></div><strong>${product.price}</strong></div></article>)}</div><div className="bag-line"><span>Bag total</span><strong>${total}</strong><button onClick={() => cart[0] && store.dispatch(remove(cart[0].id))}>Remove first item</button></div></section><footer id="story"><span>Morrow Supply Co.</span><span>Made for the long way home.</span></footer></main>;
}
const client = new ApolloClient({ link: new HttpLink({ uri: import.meta.env.VITE_GRAPHQL_URL ?? 'http://localhost:4000/graphql' }), cache: new InMemoryCache() });
createRoot(document.getElementById('root')!).render(<React.StrictMode><Provider store={store}><ApolloProvider client={client}><App /></ApolloProvider></Provider></React.StrictMode>);