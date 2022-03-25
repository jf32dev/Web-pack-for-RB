#!/bin/bash

src_dir="src/"
output_dir=$src_dir"components"

echo 'Create new Component: ' $1

if [ "$1" = undefined ]; then
  echo "No component name entered"
  else
    mkdir $output_dir/$1
    sed "s/Blank/`echo $1`/g" $output_dir/Blank/Blank.js > $output_dir/$1/$1.js
    sed "s/Blank/`echo $1`/g" $output_dir/Blank/Blank.less > $output_dir/$1/$1.less
    echo "Output: " $output_dir"/"$1"/"$1".js"
    echo "Output: " $output_dir"/"$1"/"$1".less"
fi
