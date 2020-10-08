#!/bin/bash
set -e
# Make sure git is installed and we are in a git tree.
command -v git >/dev/null                       || { echo "UNKNOWN"; exit 0; }
git rev-parse --is-inside-work-tree &>/dev/null || { echo "UNKNOWN"; exit 0; }

# Read the next version from the VERSION file and determine when it was last changed.
VERSION_FILE="${BASH_SOURCE%/*}/../VERSION"
NEXT_VERSION=$(cat $VERSION_FILE | sed 's/^[ \n\t]*//;s/[ \n\t]*$//')
VERSION_CHANGE_COMMIT=$(git log -n 1 $VERSION_FILE | head -1 | cut -d' ' -f2)

# Look for the version tag.
CURRENT_COMMIT=$(git rev-parse HEAD)
CURRENT_COMMIT_SHORT=$(git rev-parse --short HEAD)
CURRENT_COMMIT_NO=$(git rev-list --count HEAD ^$VERSION_CHANGE_COMMIT)

LATEST_VERSION_TAG=$(git describe --tags --match "v[0-9]*" --abbrev=0)
VERSION_TAG_COMMIT=$(git show-ref $LATEST_VERSION_TAG | cut -d' ' -f1)

# Determine the current branch.
CURRENT_BRANCH="$GIT_BRANCH"
if [ "$CURRENT_BRANCH" == "" ]; then
    CURRENT_BRANCH="$BRANCH_NAME"
fi

if [ "$CURRENT_BRANCH" == "" ]; then
    CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
fi

CURRENT_BRANCH="$(echo $CURRENT_BRANCH | sed 's/_/-/g')"

# Dump some debug information.
if [ "$DEBUG" != "" ]; then
    echo "Next version          : $NEXT_VERSION"
    echo "Version change commit : $VERSION_CHANGE_COMMIT"
    echo "Latest version tag    : $LATEST_VERSION_TAG"
    echo "Version tag commit-ID : $VERSION_TAG_COMMIT"
    echo "Current commit-ID     : $CURRENT_COMMIT"
    echo "Current branch        : $CURRENT_BRANCH"
fi

if [ "$VERSION_TAG_COMMIT" == "$CURRENT_COMMIT" ]; then
    # Always use the tag if the current commit is the tag.
    echo "$LATEST_VERSION_TAG"
elif [[ "$CURRENT_BRANCH" =~ ^release-v[0-9]+\.[0-9]+$ ]]; then
    # Release branch of the form release-v<MAJOR>.<MINOR>.
    if [ "$LATEST_VERSION_TAG" == "$NEXT_VERSION.0" ]; then
        # Post-release: v0.12.17
        PATCH_NO=$(git rev-list --count HEAD ^$VERSION_TAG_COMMIT)
        echo "$NEXT_VERSION.$PATCH_NO"
    else
        # Pre-release: v0.12.0-pre.17+9a1fbdb29
        echo "$NEXT_VERSION.0-pre.$CURRENT_COMMIT_NO+$CURRENT_COMMIT_SHORT"
    fi
elif [ "$CURRENT_BRANCH" == "master" ]; then
    # Master branch: v0.12.0-pre.17+9a1fbdb29
    echo "$NEXT_VERSION.0-pre.$CURRENT_COMMIT_NO+$CURRENT_COMMIT_SHORT"
else
    # Other branch: v0.12.0-pre.17+status-display.9a1fbdb29
    echo "$NEXT_VERSION.0-pre.$CURRENT_COMMIT_NO+$CURRENT_BRANCH.$CURRENT_COMMIT_SHORT"
fi
