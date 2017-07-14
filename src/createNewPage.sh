#!/bin/bash
if [[ $1 == "" ]]
then
  echo "Passe o nome da nova página como argumento"
  exit 1
else
  newPage=$(echo $1 | sed 's#\<.#\L&#')
fi

capNewPage=$(echo $newPage | sed 's#\<.#\U&#')

cp components/Template.jsx components/"$capNewPage".jsx
cp containers/Template.jsx containers/"$capNewPage"Container.jsx
cp reducers/template.jsx reducers/"$newPage".jsx
cp sagas/template.jsx sagas/"$newPage".jsx

for file in $(find ./* -iname *$newPage*)
do
	sed -i "s#template#$newPage#g" $file
	sed -i "s#Template#$capNewPage#g" $file
done
