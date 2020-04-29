import sys
import pickle
import pathlib
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler

pickle_file = str(pathlib.Path(__file__).parent.absolute()) + '/pickles/LogReg_1.pkl'

# Data to be (or not) standardized
# not_standard = ['Label', 'Dst Port', 'Protocol']
# not_standard = ['Label', 'Protocol']
not_standard = ['Label']

# If prob >= LIMIT then it is considered attack
_LIMIT = 0.95


##############################
##      Extra functions     ##
##############################

def standardize_one(df, standard, not_standard):
  not_std = df[not_standard] # what we dont want to standardize
  to_std = df[standard] # what we want to standardize

  std = StandardScaler()

  values = std.fit_transform(to_std.values)

  to_std = pd.DataFrame(values, index=to_std.index, columns=to_std.columns)
  return pd.concat([not_std,to_std], axis=1)

###############################


# df: dataframe as loaded from csv
# df_predict: dataframe suitable for prediction (less columns) and preprocessed
# df_info: dataframe with info data like timestamp, IPs...
# model: model as loaded from pickle
# filename: csv filename
# only_info: name of the headers of df_info
#
# fun preproc_dataset: preproc function. Prepare dataframes and standardize them
# fun predict: makes a prediction and returns a complete df merging df_info and df_predict
class Model:
    '''ML python model'''
    def __init__(self, filename):
        # Loads pickled model
        with open(pickle_file, 'rb') as f:
            self.model = pickle.load(f)

        # Loads CSV
        try:
            self.df = pd.read_csv(filename, sep=",", header=0, index_col=None, low_memory=False)
        except:
            print("File not found")
            exit(3)

        self.filename = filename
        return

    def preproc_dataset(self):
        # We only want some columns.
        # This is the dataframe used to predict, which will need standardization
        self.df_predict = self.df[self.model.data_header]

        # Info that we need for our application which is not included at prediction time
        # self.only_info = ['Timestamp', 'Src IP', 'Dst IP']
        # Save to join them later
        # self.df_info = self.df[self.only_info]

        # standard = list( set(self.df_predict.columns) - set(not_standard))
        # self.df_predict = standardize_one(self.df_predict, standard, not_standard) # Standardize
        return

    def predict(self):
        try:
            x_set = self.df_predict.loc[:, self.df_predict.columns != 'Label']
            # translator = np.vectorize(lambda x: 'Attack' if x == 1 else 'Benign')
            # translator = np.vectorize(lambda x: 'Attack ' + "{:.2f}".format(float(x)) if x >= _LIMIT else 'Benign ' + "{:.2f}".format(float(x)))
            translator = np.vectorize(lambda x: 'Attack' if x >= _LIMIT else 'Benign')
            # self.df['Label'] = translator(self.model.predict(x_set))
            self.df['Label'] = translator(self.model.predict_proba(x_set))
        except:
            exit(4)

        return

    def save_df(self):
        self.df.to_csv(self.filename, index=False)



def main():
    if len(sys.argv) != 2:
        exit(2)

    filename = sys.argv[1]
    
    model = Model(filename)

    model.preproc_dataset()
    model.predict()
    model.save_df()


if __name__ == '__main__':
    main()
