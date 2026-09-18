import express from 'express';
import { getTop20, marketApi } from '../services/marketApi.js';
import { runBot } from '../services/bot.js';
import { getAccount, getOrders, getBotRuns } from '../store.js';

const router = express.Router();

router.get('/health', (_req, res) => res.json({ ok: true, time: new Date().toISOString(), persistence: 'process-memory' }));
router.get('/coins/top20', async (_req, res, next) => { try { res.json(await getTop20()); } catch (e) { next(e); } });
router.post('/bot/run', async (_req, res, next) => { try { res.json(await runBot()); } catch (e) { next(e); } });
router.get('/paper/account', async (_req, res, next) => { try { res.json(await getAccount()); } catch (e) { next(e); } });
router.get('/paper/orders', (_req, res) => res.json(getOrders(100)));
router.get('/bot/runs', (_req, res) => res.json(getBotRuns(50)));

router.get('/market/01-markets', async (req,res,next)=>{try{res.json(await marketApi.markets(req.query));}catch(e){next(e);}});
router.get('/market/02-global', async (_req,res,next)=>{try{res.json(await marketApi.global());}catch(e){next(e);}});
router.get('/market/03-search', async (req,res,next)=>{try{res.json(await marketApi.search(req.query.q || 'bitcoin'));}catch(e){next(e);}});
router.get('/market/04-coin/:id', async (req,res,next)=>{try{res.json(await marketApi.coin(req.params.id));}catch(e){next(e);}});
router.get('/market/05-chart/:id', async (req,res,next)=>{try{res.json(await marketApi.marketChart(req.params.id, req.query.days || 7));}catch(e){next(e);}});
router.get('/market/06-ohlc/:id', async (req,res,next)=>{try{res.json(await marketApi.ohlc(req.params.id, req.query.days || 7));}catch(e){next(e);}});
router.get('/market/07-tickers/:id', async (req,res,next)=>{try{res.json(await marketApi.tickers(req.params.id));}catch(e){next(e);}});
router.get('/market/08-history/:id', async (req,res,next)=>{try{res.json(await marketApi.history(req.params.id, req.query.date || '01-01-2026'));}catch(e){next(e);}});
router.get('/market/09-range/:id', async (req,res,next)=>{try{res.json(await marketApi.rangeChart(req.params.id, req.query.from, req.query.to));}catch(e){next(e);}});
router.get('/market/10-contract/:platform/:address', async (req,res,next)=>{try{res.json(await marketApi.contract(req.params.platform, req.params.address));}catch(e){next(e);}});
router.get('/market/11-community/:id', async (req,res,next)=>{try{res.json(await marketApi.communityData(req.params.id));}catch(e){next(e);}});
router.get('/market/12-developer/:id', async (req,res,next)=>{try{res.json(await marketApi.developerData(req.params.id));}catch(e){next(e);}});
router.get('/market/13-status/:id', async (req,res,next)=>{try{res.json(await marketApi.statusUpdates(req.params.id));}catch(e){next(e);}});
router.get('/market/14-localization/:id', async (req,res,next)=>{try{res.json(await marketApi.localization(req.params.id));}catch(e){next(e);}});
router.get('/market/15-list', async (_req,res,next)=>{try{res.json(await marketApi.coinList());}catch(e){next(e);}});
router.get('/market/16-exchanges', async (_req,res,next)=>{try{res.json(await marketApi.exchanges());}catch(e){next(e);}});
router.get('/market/17-exchange/:id', async (req,res,next)=>{try{res.json(await marketApi.exchange(req.params.id));}catch(e){next(e);}});
router.get('/market/18-exchange-tickers/:id', async (req,res,next)=>{try{res.json(await marketApi.exchangeTickers(req.params.id));}catch(e){next(e);}});
router.get('/market/19-categories', async (_req,res,next)=>{try{res.json(await marketApi.categories());}catch(e){next(e);}});
router.get('/market/20-derivatives', async (_req,res,next)=>{try{res.json(await marketApi.derivatives());}catch(e){next(e);}});

export default router;
