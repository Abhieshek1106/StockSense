# StockSense DWM mini-project
Run `pip install -r requirements.txt`, then `python app.py`, and open http://127.0.0.1:5000.

The included 100-row CSV has the selected input columns plus `Target_Direction` and `Target_Return`. Data and labels are synthetic for demonstrating the pipeline, not actual historical market data. Replace them with real date-indexed observations and use chronological testing before reporting model performance. `Bollinger_Bands` is represented as band-width percentage because one scalar cannot contain both upper and lower bands.
