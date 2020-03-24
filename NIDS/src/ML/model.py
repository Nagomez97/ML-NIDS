import sys
import pickle
import pathlib
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler

pickle_file = str(pathlib.Path(__file__).parent.absolute()) + '/pickles/LogReg_1.pkl'

# Data to be (or not) standardized
not_standard = ['Label', 'Dst Port', 'Protocol']

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


def standardize(train, test, standard, not_standard):
  not_std_train = train[not_standard]
  to_std_train = train[standard]

  not_std_test = test[not_standard]
  to_std_test = test[standard]

  std = StandardScaler()

  values_train = std.fit_transform(to_std_train.values)
  values_test = std.transform(to_std_test.values)

  to_std_train = pd.DataFrame(values_train, index=to_std_train.index, columns=to_std_train.columns)
  to_std_test = pd.DataFrame(values_test, index=to_std_test.index, columns=to_std_test.columns)

  return pd.concat([not_std_train, to_std_train], axis=1), pd.concat([not_std_test, to_std_test], axis=1)

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
        self.df = pd.read_csv(filename, sep=",", header=0, index_col=None, low_memory=False)

        self.filename = filename
        return

    def preproc_dataset(self):
        # We only want some columns
        self.df_predict = self.df[self.model.data_header]

        # Info that we need for our application
        self.only_info = ['Timestamp', 'Src IP', 'Dst IP']
        # Save to join them later
        self.df_info = self.df[self.only_info]

        standard = list( set(self.df_predict.columns) - set(not_standard))
        self.df_predict = standardize_one(self.df_predict, standard, not_standard) # Standardize
        return

    def predict(self):
        x_set = self.df_predict.loc[:, self.df_predict.columns != 'Label']
        translator = np.vectorize(lambda x: 'Attack' if x == 1 or x == '1' else 'Benign')
        self.df['Label'] = translator(self.model.predict(x_set))
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
