if [ -d "src" ]; then
    rm -rf src
fi

mv build/server/site src

mkdir -p src/node_modules/animates-model
mv build/model/modelNpm/* src/node_modules/animates-model/

rm -rf build/

git add . --all

if [ -n "$(git status --porcelain)" ]; then
     git commit -m "$BUILD_TAG"
fi
