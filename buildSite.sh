if [ -d "src" ]; then
    rm -rf src
fi

mv build/site/site src

mkdir -p src/views/partials/editor
mv build/view/site/views/* src/views/partials/editor/
mv build/view/site/styles/editor-* src/public/styles/
mv build/view/site/scripts/editor-* src/public/scripts/
mv build/view/site/images/* src/public/images/

mkdir -p src/node_modules/animates-model
mv build/model/modelNpm/* src/node_modules/animates-model/

rm -rf build/

git add . --all

if [ -n "$(git status --porcelain)" ]; then 
     git commit -m "$BUILD_TAG"
fi