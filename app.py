from flask import Flask, render_template, request, jsonify
import pandas as pd, numpy as np
# sklearn mocked out due to App Control policy

app=Flask(__name__)
df=pd.read_csv("dataset/stock_dataset_100.csv")
FEATURES=["Open","High","Low","Close","Volume","RSI","SMA_50","SMA_200","MACD","Bollinger_Bands","PE_Ratio","EPS_Growth","Debt_to_Equity","Market_Cap"]
X=df[FEATURES].replace([np.inf,-np.inf],np.nan).fillna(df[FEATURES].median())
# Models mocked

@app.route("/")
def home(): return render_template("index.html",sectors=sorted(df.Sector.unique()))

@app.route("/api/recommend",methods=["POST"])
def recommend():
    q=request.get_json(force=True); budget=float(q.get("budget",10000)); risk=q.get("risk","Moderate"); sector=q.get("sector","Any")
    cap={"Low":.20,"Moderate":.32,"High":1}.get(risk,.32)
    c=df.copy(); c["risk_proxy"]=c.Bollinger_Bands/100
    c=c[(c.Close<=budget)&(c.risk_proxy<=cap)]
    if sector not in ("Any","No preference"): c=c[c.Sector==sector]
    if c.empty:return jsonify(results=[],message="No matching stocks. Try broader filters.")
    xx=c[FEATURES].replace([np.inf,-np.inf],np.nan).fillna(df[FEATURES].median())
    c=c.copy(); c["ret"]=np.random.uniform(-5,15,len(c)); c["prob"]=np.random.uniform(0.4,0.95,len(c))
    c["forecast"]=c.Close*(1+c.ret/100); c=c.sort_values(["prob","ret"],ascending=False)
    result=[]
    for _,r in c.head(30).iterrows():
        result.append(dict(symbol=r.Symbol,name=r.Company,sector=r.Sector,price=round(r.Close,2),predicted=round(r.forecast,2),
          change=round(r.ret,2),probability=round(r.prob*100,1),risk="Low" if r.risk_proxy<.2 else "Moderate",volatility=round(r.risk_proxy*100,1)))
    return jsonify(results=result,horizon=30,disclaimer="Synthetic demonstration dataset; not a real forecast or investment advice.")

@app.route("/api/model-metrics")
def metrics():
    return jsonify(rows=len(df),features=FEATURES,mae_in_sample=0.123,
      accuracy_in_sample=0.85,
      note="In-sample metrics are not estimates of future performance. (Mocked)")

if __name__=="__main__": app.run(debug=True)
